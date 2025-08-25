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
            setTimeout(() => onNewItemDisplayed(data.id), 100);
        }
    }, [data.isNew, data.id, onNewItemDisplayed]);

    return (
        <div
            className={`form-data-tile ${data.isNew ? 'new-submission' : ''}`}
        >
            <div className="wrapper-tile">
                {data.image && (
                    <img
                        src={data.image}
                        alt="User"
                    />
                )}
                <div className='tile-info'>
                    <h3>{data.name}</h3>
                    <p>
                        <strong>Age:</strong> {data.age}
                    </p>
                    <p>
                        <strong>Email:</strong> {data.email}
                    </p>
                    <p>
                        <strong>Gender:</strong> {data.gender}
                    </p>
                    <p>
                        <strong>Country:</strong> {data.country}
                    </p>
                    <p>
                        <strong>Submitted:</strong>{' '}
                        {new Date(data.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormDataTile;
