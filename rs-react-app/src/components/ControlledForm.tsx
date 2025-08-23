import React from "react";
import { useForm } from "react-hook-form";

type HookFormData = {
  name: string;
  email: string;
};

const HookForm: React.FC = () => {
  const { register, handleSubmit } = useForm<HookFormData>();

  const onSubmit = (data: HookFormData) => {
    console.log("React Hook Form:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>React Hook Form</h2>
      <input
        {...register("name")}
        placeholder="Name"
      />
      <input
        {...register("email")}
        type="email"
        placeholder="Email"
      />
      <button
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default HookForm;