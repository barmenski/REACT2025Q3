import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import CountryAutocomplete from './CountryAutocomplete';
import type { AppDispatch } from '../store';
import {
  addFormData,
  type FormData as ReduxFormData,
} from '../store/formSlice';

const createEmptyFileList = (): FileList => {
  const dataTransfer = new DataTransfer();
  return dataTransfer.files;
};

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'First letter must be uppercase'),
    age: z.coerce
      .number()
      .min(0, 'Age cannot be negative')
      .int('Age must be integer')
      .positive('Age must be positive'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least 1 number')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least 1 special character'
      ),
    retypePassword: z.string(),
    gender: z.string().min(1, 'Gender is required'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept terms & conditions',
    }),
    image: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, 'Image is required')
      .refine(
        (files) => files[0]?.size <= 5 * 1024 * 1024,
        'Max image size is 5MB'
      )
      .refine(
        (files) => ['image/jpeg', 'image/png'].includes(files[0]?.type),
        'Only JPEG and PNG images are allowed'
      ),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Passwords don't match",
    path: ['retypePassword'],
  });

type FormErrors = {
  [K in keyof z.infer<typeof formSchema>]?: string;
};

interface UncontrolledFormProps {
  onSuccess: (data: ReduxFormData) => void;
}

function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<FormErrors>({});

  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputAgeRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPassRef = useRef<HTMLInputElement>(null);
  const inputMatchRef = useRef<HTMLInputElement>(null);
  const inputMaleRef = useRef<HTMLInputElement>(null);
  const inputFemaleRef = useRef<HTMLInputElement>(null);
  const inputTCRef = useRef<HTMLInputElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const inputCountryRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = inputNameRef.current?.value || '';
    const age = inputAgeRef.current?.value || '';
    const email = inputEmailRef.current?.value || '';
    const password = inputPassRef.current?.value || '';
    const retypePassword = inputMatchRef.current?.value || '';
    const gender = inputMaleRef.current?.checked
      ? 'male'
      : inputFemaleRef.current?.checked
        ? 'female'
        : '';
    const terms = inputTCRef.current?.checked || false;
    const image = inputImageRef.current?.files || createEmptyFileList();
    const country = inputCountryRef.current?.value || '';

    const formData = {
      name,
      age,
      email,
      password,
      retypePassword,
      gender,
      terms,
      image,
      country,
    };

    try {
      const validatedData = formSchema.parse(formData);

      let imageBase64 = '';
      if (validatedData.image.length > 0) {
        imageBase64 = await fileToBase64(validatedData.image[0]);
      }

      // Передаем данные без id - Redux сам сгенерирует его
      const formDataWithoutId = {
        name: validatedData.name,
        age: validatedData.age,
        email: validatedData.email,
        gender: validatedData.gender,
        terms: validatedData.terms,
        image: imageBase64,
        country: validatedData.country,
        timestamp: new Date().toISOString(),
      };

      // Диспатчим данные - Redux добавит id автоматически
      dispatch(addFormData(formDataWithoutId));
      setErrors({});

      // Для onSuccess нужно создать объект с id (можно сгенерировать временный)
      const tempData: ReduxFormData = {
        id: 'temp-' + Math.random().toString(36).substr(2, 9),
        ...formDataWithoutId,
      };
      onSuccess(tempData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof FormErrors;
          if (path) {
            newErrors[path] = issue.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form className="wrapper-form" onSubmit={handleSubmit}>
      <h2 className="header-form">Uncontrolled Form</h2>
      <ul className="list-inputs">
        <li>
          <label htmlFor="name" className="label-input">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="input-form"
            ref={inputNameRef}
          />
          {errors.name && <div className="error-massage">{errors.name}</div>}
        </li>
        <li>
          <label htmlFor="age" className="label-input">
            Age
          </label>
          <input
            id="age"
            type="number"
            className="input-form"
            ref={inputAgeRef}
          />
          {errors.age && <div className="error-massage">{errors.age}</div>}
        </li>
        <li>
          <label htmlFor="email" className="label-input">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-form"
            ref={inputEmailRef}
          />
          {errors.email && <div className="error-massage">{errors.email}</div>}
        </li>
        <li>
          <label htmlFor="password" className="label-input">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-form"
            ref={inputPassRef}
          />
          {errors.password && (
            <div className="error-massage">{errors.password}</div>
          )}
        </li>
        <li>
          <label htmlFor="repass" className="label-input">
            Retype password
          </label>
          <input
            id="repass"
            type="password"
            className="input-form"
            ref={inputMatchRef}
          />
          {errors.retypePassword && (
            <div className="error-massage">{errors.retypePassword}</div>
          )}
        </li>
        <li>
          <label className="label-input">Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                ref={inputMaleRef}
              />{' '}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                ref={inputFemaleRef}
              />{' '}
              Female
            </label>
          </div>
          {errors.gender && (
            <div className="error-massage">{errors.gender}</div>
          )}
        </li>
        <li>
          <label>
            <input type="checkbox" ref={inputTCRef} /> Accept terms & conditions
          </label>
          {errors.terms && <div className="error-massage">{errors.terms}</div>}
        </li>
        <li>
          <label htmlFor="image" className="label-input">
            Image
          </label>
          <input
            id="image"
            type="file"
            className="input-form"
            ref={inputImageRef}
            accept=".jpg,.jpeg,.png"
          />
          {errors.image && <div className="error-massage">{errors.image}</div>}
        </li>
        <li>
          <label className="label-input">Country</label>
          <CountryAutocomplete ref={inputCountryRef} />
          {errors.country && (
            <div className="error-massage">{errors.country}</div>
          )}
        </li>
      </ul>
      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
