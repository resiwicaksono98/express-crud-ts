import { app } from "../src/applications/app";
import supertest from "supertest";
import { ContactTest, UserTest } from "./test.util";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should create new contact", async () => {
    const response = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "Resi",
        last_name: "Wicaksono",
        email: "resi@gmail.com",
        phone: "08999999"
      });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("Resi");
    expect(response.body.data.last_name).toBe("Wicaksono");
    expect(response.body.data.email).toBe("resi@gmail.com");
    expect(response.body.data.phone).toBe("08999999");
  });

  it("should create new contact is invalid", async () => {
    const response = await supertest(app)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "resi",
        phone: "08999999"
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able get contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it("should reject get contact if contact not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to update contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "resi",
        last_name: "wicaksono",
        email: "resi@gmail.com",
        phone: "081311292038"
      });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe("resi");
    expect(response.body.data.last_name).toBe("wicaksono");
    expect(response.body.data.email).toBe("resi@gmail.com");
    expect(response.body.data.phone).toBe("081311292038");
  });

  it("should reject to update contact invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be contact delete", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
  });
  it("should reject contact delete if not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should get all contacts", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.paging.page).toBe(1);
    expect(response.body.paging.perPage).toBe(10);
    expect(response.body.paging.totalPages).toBe(1);
  });
  it("should be able to search contact using name", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({ name: "es" });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.paging.page).toBe(1);
    expect(response.body.paging.perPage).toBe(10);
    expect(response.body.paging.totalPages).toBe(1);
  });
  it("should be able to search contact using email", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({ email: ".com" });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.paging.page).toBe(1);
    expect(response.body.paging.perPage).toBe(10);
    expect(response.body.paging.totalPages).toBe(1);
  });
  it("should be able to search contact using phone", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({ phone: "99999" });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.paging.page).toBe(1);
    expect(response.body.paging.perPage).toBe(10);
    expect(response.body.paging.totalPages).toBe(1);
  });

  it("should be able to search contact no result", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({ name: "zzz" });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.page).toBe(1);
    expect(response.body.paging.totalPages).toBe(0);
    expect(response.body.paging.perPage).toBe(10);
  });

  it("should be able to search contact with paging", async () => {
    const response = await supertest(app)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({ page: 2, perPage: 1 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.page).toBe(2);
    expect(response.body.paging.totalPages).toBe(1);
    expect(response.body.paging.perPage).toBe(1);
  });
});
