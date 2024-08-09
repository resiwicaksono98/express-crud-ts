import supertest from "supertest";
import { app } from "../src/applications/app";
import { UserTest } from "./test.util";
import bcrypt from "bcrypt";
describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "",
      password: "",
      name: ""
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "test",
      password: "test",
      name: "test"
    });
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject login if credentials are invalid", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "testss",
      password: "wrongpassword"
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should login with correct credentials", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      username: "test",
      password: "test"
    });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });
});

describe("GET /api/users/me", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to get user", async () => {
    const response = await supertest(app)
      .get("/api/users/me")
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });

  it("should reject get user if invalid token", async () => {
    const response = await supertest(app)
      .get("/api/users/me")
      .set("X-API-TOKEN", "wrongToken");

    expect(response.status).toBe(401);
    expect(response.error).toBeDefined();
  });
});

describe("PUT /api/users", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject update user if request invalid", async () => {
    const response = await supertest(app)
      .put("/api/users")
      .set("X-API-TOKEN", "test")
      .send({
        name: "",
        password: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject update user if token is wrong", async () => {
    const response = await supertest(app)
      .put("/api/users")
      .set("X-API-TOKEN", "slag")
      .send({
        name: "beanr",
        password: "benar"
      });
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to update username", async () => {
    const response = await supertest(app)
      .put("/api/users")
      .set("X-API-TOKEN", "test")
      .send({
        name: "resi"
      });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("resi");
  });
  it("should be able to update password", async () => {
    const response = await supertest(app)
      .put("/api/users")
      .set("X-API-TOKEN", "test")
      .send({
        password: "benar"
      });

    expect(response.status).toBe(200);
    const user = await UserTest.get();
    expect(await bcrypt.compare("benar", user.password)).toBe(true);
  });
});

describe("DELETE /api/users", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to logout", async () => {
    const response = await supertest(app)
    .delete("/api/users")
    .set("X-API-TOKEN", "test")

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");

    const user = await UserTest.get();
    expect(user.token).toBeNull();
  })

  it("should reject token is wrong", async () => {
    const response = await supertest(app)
    .delete("/api/users")
    .set("X-API-TOKEN", "wrong")

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();

  })
});
