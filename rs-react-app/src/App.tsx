import { useState } from 'react';
import Header from './components/Header'
import UncontrolledForm from './components/UncontrolledForm'
import Modal from './components/Modal';
import HookForm from './components/ControlledForm';

const App: React.FC = () => {
  const [openModal, setOpenModal] = useState<"none" | "uncontrolled" | "hook">(
    "none"
  );

  return (
    <div className="wrapper">
      <Header />

      <div className="wrapper-button">
        <button
          onClick={() => setOpenModal("uncontrolled")}

        >
          Open Uncontrolled Form
        </button>
        <button
          onClick={() => setOpenModal("hook")}

        >
          Open Hook Form
        </button>
      </div>

      <Modal
        isOpen={openModal === "uncontrolled"}
        onClose={() => setOpenModal("none")}
      >
        <UncontrolledForm />
      </Modal>

      <Modal
        isOpen={openModal === "hook"}
        onClose={() => setOpenModal("none")}
      >
        <HookForm />
      </Modal>
    </div>
  );
};

export default App
