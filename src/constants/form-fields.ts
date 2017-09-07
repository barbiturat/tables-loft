export type ManagerLoginForm = {
  readonly validators: {
    readonly password: {
      readonly isFilled: string,
      readonly isCorrect: string
    }
  }
};

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

export const managerLoginForm: ManagerLoginForm = {
  validators: {
    password: {
      isFilled: 'isFilled',
      isCorrect: 'isCorrect'
    }
  }
};
