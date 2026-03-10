import toast from 'react-hot-toast';

export const showMessage = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      // Style tùy chỉnh cho thương hiệu của bạn (ví dụ Furniro)
      style: {
        border: '1px solid #B88E2F',
        padding: '16px',
        color: '#3A3A3A',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#B88E2F',
        secondary: '#FFFAEE',
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  }
};