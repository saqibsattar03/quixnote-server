export class Validations {
  static ValidateLoginOption = async (loginVia: string): Promise<boolean> => {
    switch (loginVia) {
      case 'Email':
        return true;
      case 'Google':
        return true;
      case 'Facebook':
        return true;
      case 'Apple':
        return true;
      default:
        return false;
    }
  };
}
