import { useState } from 'react';
import Header from './components/Header';
import UncontrolledForm from './components/UncontrolledForm';
import Modal from './components/Modal';
import ControlledForm from './components/ControlledForm';

import FormSubmissions from './components/FormSubmissions';

const App: React.FC = () => {
  const [openModal, setOpenModal] = useState<'none' | 'uncontrolled' | 'hook'>(
    'none'
  );

  const handleFormSuccess = () => {
    setOpenModal('none');
  };

  return (
    <div className="wrapper">
      <Header />

      <div className="wrapper-button">
        <button onClick={() => setOpenModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button onClick={() => setOpenModal('hook')}>
          Open Controlled Form
        </button>
      </div>
      <FormSubmissions />
      <Modal
        isOpen={openModal === 'uncontrolled'}
        onClose={() => setOpenModal('none')}
      >
        <UncontrolledForm onSuccess={handleFormSuccess} />
      </Modal>

      <Modal isOpen={openModal === 'hook'} onClose={() => setOpenModal('none')}>
        <ControlledForm onSuccess={handleFormSuccess} />
      </Modal>
    </div>
  );
};

export default App;
