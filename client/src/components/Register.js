import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Register.css'; 

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
    <div className='main-container'>
      <div className='register-contain'>
      <div className='register'>
      <div>
      <h2>Register</h2> 
      </div>
      </div>
      <form  className='form-group' onSubmit={formik.handleSubmit}>
        <input 
          name="username" 
          onChange={formik.handleChange} 
          value={formik.values.username} 
          placeholder="Username"
        />
        {formik.errors.username ? <div style={{ color: 'red' }}>{formik.errors.username}</div> : null}

        <input 
          name="email" 
          onChange={formik.handleChange} 
          value={formik.values.email} 
          placeholder="Email"
        />
        {formik.errors.email ? <div style={{ color: 'red' }}>{formik.errors.email}</div> : null}

        <input 
          name="password" 
          type="password" 
          onChange={formik.handleChange} 
          value={formik.values.password} 
          placeholder="Password"
        />
        {formik.errors.password ? <div style={{ color: 'red' }}>{formik.errors.password}</div> : null}

        <div className='button-container'>
        <button className='custom-button btn btn-primary' type="submit">Register</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Register;
