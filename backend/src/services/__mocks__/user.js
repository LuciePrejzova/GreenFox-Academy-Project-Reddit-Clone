
class UserService {
  async createUser(req) {
    return;
  }

  async findByUserNameOrEmail(req) {
    return {
      name: "Klem"
    };
  };

  async findByToken(userToken) {
    return undefined;
  };

  async findByUserName(req) {
    return {
      id: 1,
      email: "test@email.com",
      activationToken: 'token'
    };
  };

}
