import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function ValidationTextFields({ title, type, value, onChange, onValidate }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateInput = (value) => {
    if (type === 'text') {
      const usernameRegex = /^[a-zA-Z0-9_.]+$/;
      if (!usernameRegex.test(value)) {
        setError("Username can only contain letters, numbers, '_', and '.'");
      } else if (value.length < 4) {
        setError('Username should be at least 4 characters long');
      } else {
        setError('');
      }
    } else if (type === 'password') {
      if (value.length < 8) {
        setError('Password should be at least 8 characters long');
      } else {
        setError('');
      }
    }

    onValidate && onValidate(value, setError); // Call custom validation if provided (e.g., server validation)
  };

  const handleChange = (event) => {
    const value = event.target.value;
    onChange(value);  // Update parent component state
    validateInput(value);
  };

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        error={Boolean(error)}
        label={title}
        variant="outlined"
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={handleChange}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {type === 'password' && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            height: '45px',
            textAlign: 'center',
            bgcolor: '#2c2c2c',
            color: '#9e9e9e',
            opacity: 1,
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3a6f98',
            bgcolor: 'white',
          },
        }}
      />
    </Box>
  );
}