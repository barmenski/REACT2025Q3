import React, { useEffect } from 'react';
import {
  markAsNotNew,
  clearAllNewFlags,
  type FormData as ReduxFormData,
} from '../store/formSlice';
import type { RootState, AppDispatch } from '../store';
import FormDataTile from './FormDataTile';
import { useDispatch, useSelector } from 'react-redux';

const FormSubmissions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const formSubmissions = useSelector(
    (state: RootState) => state.form.submissions
  );
  const handleNewItemDisplayed = (id: string) => {
    setTimeout(() => {
      dispatch(markAsNotNew(id));
    }, 3000);
  };
  useEffect(() => {
    dispatch(clearAllNewFlags());
  }, [dispatch]);
  return (
    <div className="wrapper-submissions">
      <h2>Form Submissions</h2>

      {formSubmissions.length === 0 ? (
        <div className="no-submissions">
          <p>No form submissions yet.</p>
          <p>Click the buttons above to submit a form!</p>
        </div>
      ) : (
        <div>
          {formSubmissions.map((submission: ReduxFormData) => (
            <FormDataTile
              key={submission.id}
              data={submission}
              onNewItemDisplayed={handleNewItemDisplayed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;
