import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import countriesReducer from "../src/store/countriesSlice";
import formReducer from "../src/store/formSlice";
import UncontrolledForm from "../src/components/UncontrolledForm";
import type { RootState } from "../src/store";


import { forwardRef } from "react";

vi.mock('../src/components/CountryAutocomplete', () => {
  return {
    default: forwardRef(( ref: any) => (
      <input ref={ref} placeholder="Select a country" />
    ))
  }
});
// --- Мок FileReader ---
class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(_file: Blob) {
    setTimeout(() => {
      this.result = "data:image/png;base64,mockedBase64";
      this.onload?.call(this as unknown as FileReader, {
        target: this as unknown as FileReader,
      } as ProgressEvent<FileReader>);
    }, 0);
  }
}
vi.stubGlobal("FileReader", MockFileReader);

// --- Мок DataTransfer ---
class MockDataTransfer {
  files: File[] = [];
  items = { add: (file: File) => this.files.push(file) };
}
vi.stubGlobal("DataTransfer", MockDataTransfer);

// --- Store ---
const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: { countries: countriesReducer, form: formReducer },
    preloadedState: {
      countries: { list: [{ code: "US", name: "United States" }, { code: "CA", name: "Canada" }] },
      form: { submissions: [] },
      ...preloadedState,
    } as RootState,
  });

describe("UncontrolledForm", () => {
  let store: ReturnType<typeof createTestStore>;
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    store = createTestStore();
    mockOnSuccess.mockClear();
  });

  it("submits form with valid data", async () => {
    render(
      <Provider store={store}>
        <UncontrolledForm onSuccess={mockOnSuccess} />
      </Provider>
    );

    // --- Inputs ---
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText("Age"), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongP@ss1" } });
    fireEvent.change(screen.getByLabelText("Retype password"), { target: { value: "StrongP@ss1" } });

    fireEvent.click(screen.getByLabelText("Male"));
    fireEvent.click(screen.getByLabelText(/Accept terms/i));

    // --- File input ---
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const fileInput = screen.getByLabelText("Image") as HTMLInputElement;
    const dt = new DataTransfer();
    dt.items.add(file);
    Object.defineProperty(fileInput, "files", { value: dt.files });
    fireEvent.change(fileInput);

    // --- Country input (мокаваны) ---
    const countryInput = screen.getByPlaceholderText("Select a country") as HTMLInputElement;
    fireEvent.change(countryInput, { target: { value: "United States" } });

    // --- Сабміт формы праз data-testid ---
    const form = screen.getByTestId("uncontrolled-form") as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    const submitted = mockOnSuccess.mock.calls[0][0];
    expect(submitted.name).toBe("John");
    expect(submitted.age).toBe("25");
    expect(submitted.email).toBe("john@example.com");
    expect(submitted.gender).toBe("male");
    expect(submitted.terms).toBe(true);
    expect(submitted.country).toBe("United States");
    expect(submitted.image).toBe("data:image/png;base64,mockedBase64");
  });
});
