const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // describe("GET /users/:id", () => {
  //   test("should get a user and a token with valid user ID", async () => {
  //     const newUser = await User.create({
  //       full_name: "Test User",
  //       email: "test@example.com",
  //       password: "testPassword",
  //     });
  //     const token = generateToken(newUser._id);
  //     const response = await request(app)
  //       .get(`/users/${newUser._id}`)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toHaveProperty("token");
  //   });
  
  //   // test("should return 401 if user ID is not found", async () => {
  //   //   const nonExistentUserId = "nonexistentuserid"; 
  //   //   const response = await request(app).get(`/users/${nonExistentUserId}`);
  //   //   expect(response.statusCode).toBe(401);
  //   //   expect(response.body).toHaveProperty("message", "User not found");
  //   // });
  // });


  describe("POST, create a new user when all the information is provided", () => {
  test("a user is created", async () => {
      const testEmail = "test_user@example.com";
      const testName = "Test User"
      const testPassword = "testPassword"
      const response = await request(app)
        .post("/users")
        .field("full_name", testName)
        .field("email", testEmail)
        .field("password", testPassword);

      expect(response.statusCode).toBe(201);

      const user = await User.findOne({ email: testEmail });
      expect(user.full_name).toBe(testName);
      expect(user.email).toBe(testEmail);
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});