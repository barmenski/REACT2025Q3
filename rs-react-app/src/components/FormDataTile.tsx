import React, { useEffect } from 'react';
import type { FormData } from '../store/formSlice';

interface FormDataTileProps {
  data: FormData;
  onNewItemDisplayed?: (id: string) => void;
}

const FormDataTile: React.FC<FormDataTileProps> = ({
  data,
  onNewItemDisplayed,
}) => {
  useEffect(() => {
    if (data.isNew && onNewItemDisplayed) {
      // Уведомляем родительский компонент, что новый элемент отобразился
      setTimeout(() => onNewItemDisplayed(data.id), 100);
    }
  }, [data.isNew, data.id, onNewItemDisplayed]);

  return (
    <div
      className={`form-data-tile ${data.isNew ? 'new-submission' : ''}`}
      style={{
        border: data.isNew ? '3px solid #4caf50' : '1px solid #ddd',
        backgroundColor: data.isNew ? '#f8fff8' : '#fff',
        padding: '1rem',
        margin: '1rem 0',
        borderRadius: '8px',
        transition: 'all 0.5s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {data.image && (
          <img
            src={data.image}
            alt="User"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{data.name}</h3>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            <strong>Age:</strong> {data.age}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            <strong>Email:</strong> {data.email}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            <strong>Gender:</strong> {data.gender}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            <strong>Country:</strong> {data.country}
          </p>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            <strong>Submitted:</strong>{' '}
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormDataTile;
