export const loginForm = {
  validators: {
    email: {
      isEmail: 'isEmail',
      isFilled: 'isFilled',
      isRegistered: 'isRegistered'
    },
    password: {
      isFilled: 'isFilled',
      isCorrect: 'isCorrect'
    }
  }
};

export const managerLoginForm = {
  validators: {
    password: {
      isFilled: 'isFilled',
      isCorrect: 'isCorrect'
    }
  }
};
