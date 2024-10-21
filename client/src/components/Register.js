import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const formik = useFormik({
    initialValues: { username: '', email: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Must be 6 characters').required('Required'),
    }),
    onSubmit: values => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input name="username" onChange={formik.handleChange} value={formik.values.username} />
      <input name="email" onChange={formik.handleChange} value={formik.values.email} />
      <input name="password" type="password" onChange={formik.handleChange} value={formik.values.password} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
