import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import CountryAutocomplete from './CountryAutocomplete';
import type { AppDispatch } from '../store';
import {
  addFormData,
  type FormData as ReduxFormData,
} from '../store/formSlice';

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

type FormValues = z.infer<typeof formSchema>;

interface ControlledFormProps {
  onSuccess: (data: ReduxFormData) => void;
}

function ControlledForm({ onSuccess }: ControlledFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting, isValid },
    setValue,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      password: '',
      retypePassword: '',
      gender: '',
      terms: false,
      image: undefined as unknown as FileList,
      country: '',
    },
  });

  const password = watch('password');
  const retypePassword = watch('retypePassword');

  useEffect(() => {
    if (password && retypePassword) {
      trigger('retypePassword');
    }
  }, [password, retypePassword, trigger]);

  const onSubmit = async (data: FormValues) => {
    try {
      let imageBase64 = '';
      if (data.image && data.image.length > 0) {
        imageBase64 = await fileToBase64(data.image[0]);
      }

      const formDataWithoutId = {
        name: data.name,
        age: data.age,
        email: data.email,
        gender: data.gender,
        terms: data.terms,
        image: imageBase64,
        country: data.country,
        timestamp: new Date().toISOString(),
      };

      console.log('Form submitted successfully:', formDataWithoutId);

      dispatch(addFormData(formDataWithoutId));

      const tempData: ReduxFormData = {
        id: 'temp-' + Math.random().toString(36).substr(2, 9),
        ...formDataWithoutId,
      };
      onSuccess(tempData);
    } catch (error) {
      console.error('Error processing form:', error);
      setError('root', { message: 'An error occurred during submission' });
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

  const handleCountryChange = (value: string) => {
    setValue('country', value, { shouldValidate: true });
    clearErrors('country');
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form className="wrapper-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="header-form">Controlled Form</h2>
      <ul className="list-inputs">
        <li>
          <label htmlFor="name" className="label-input">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="input-form"
            {...register('name')}
          />
          {errors.name && (
            <div className="error-massage">{errors.name?.message}</div>
          )}
        </li>

        <li>
          <label htmlFor="age" className="label-input">
            Age
          </label>
          <input
            id="age"
            type="number"
            className="input-form"
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && (
            <div className="error-massage">{errors.age?.message}</div>
          )}
        </li>

        <li>
          <label htmlFor="email" className="label-input">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-form"
            {...register('email')}
          />
          {errors.email && (
            <div className="error-massage">{errors.email?.message}</div>
          )}
        </li>

        <li>
          <label htmlFor="password" className="label-input">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-form"
            {...register('password')}
          />
          {errors.password && (
            <div className="error-massage">{errors.password?.message}</div>
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
            {...register('retypePassword')}
          />
          {errors.retypePassword && (
            <div className="error-massage">
              {errors.retypePassword?.message}
            </div>
          )}
        </li>

        <li>
          <label className="label-input">Gender</label>
          <div>
            <label>
              <input type="radio" value="male" {...register('gender')} /> Male
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input type="radio" value="female" {...register('gender')} />{' '}
              Female
            </label>
          </div>
          {errors.gender && (
            <div className="error-massage">{errors.gender?.message}</div>
          )}
        </li>

        <li>
          <label>
            <input type="checkbox" {...register('terms')} /> Accept terms &
            conditions
          </label>
          {errors.terms && (
            <div className="error-massage">{errors.terms?.message}</div>
          )}
        </li>

        <li>
          <label htmlFor="image" className="label-input">
            Image
          </label>
          <input
            id="image"
            type="file"
            className="input-form"
            accept=".jpg,.jpeg,.png"
            {...register('image')}
          />
          {errors.image && (
            <div className="error-massage">{errors.image?.message}</div>
          )}
        </li>

        <li>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountryAutocomplete
                value={field.value}
                onChange={handleCountryChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.country && (
            <div className="error-massage">{errors.country?.message}</div>
          )}
        </li>
      </ul>

      {errors.root && (
        <div className="error-massage" style={{ marginBottom: '1rem' }}>
          {errors.root?.message}
        </div>
      )}

      <button
        type="submit"
        disabled={hasErrors || isSubmitting}
        style={{
          opacity: hasErrors || isSubmitting ? 0.6 : 1,
          cursor: hasErrors || isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p>Form status: {isValid ? '✓ Valid' : '✗ Invalid'}</p>
        <p>Errors: {Object.keys(errors).length}</p>
      </div>
    </form>
  );
}

export default ControlledForm;
