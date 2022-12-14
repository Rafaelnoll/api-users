const app = require("../src/app");
const supertest = require("supertest");
const request = supertest(app);

const mainUser = {
    name: "Rafael Noll",
    email: "rafael@email.com",
    password: "12345"
};

beforeAll(() => {
    return request.post("/user").send(mainUser)
        .then(res => { })
        .catch(err => { console.log(err) });
});

afterAll(() => {
    return request.delete(`/user/${mainUser.email}`)
        .then(res => { })
        .catch(err => { console.log(err) });
});

describe("Cadastro de usuário", () => {

    test("Deve cadastrar um usuário com sucesso", () => {
        const time = Date.now();
        const email = `${time}@gmail.com` // Create a "unique" email for the test
        const user = {
            name: "Rafael",
            email,
            password: "12345"
        }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(email);
            }).catch((err) => {
                fail(err);
            });
    });

    test("Deve impedir que um usuário se cadastre com os dados vazios", () => {

        const user = { name: "", email: "", password: "" }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(400); // 400 = Bad Request
            }).catch((err) => {
                fail(err);
            });
    });

    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {

        const time = Date.now();
        const email = `${time}@gmail.com` // Create a "unique" email for the test
        const user = {
            name: "Rafael",
            email,
            password: "12345"
        }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(email);

                return request.post("/user")
                    .send(user)
                    .then((res) => {
                        expect(res.statusCode).toEqual(400);
                        expect(res.body.error).toEqual("E-mail already registered");
                    }).catch(err => {
                        fail(err);
                    });
            }).catch((err) => {
                fail(err);
            });

    });

});

describe("Autenticação", () => {
    test("Deve me retornar um token quando logar", () => {
        return request.post("/auth")
            .send({ email: mainUser.email, password: mainUser.password })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined()
            }).catch(err => {
                fail(err);
            });
    });

    test("Deve impedir que um usuário não cadastrado receba o token de autenticação", () => {
        return request.post("/auth")
            .send({ email: "umemailqualquer@teste.com", password: "senhaerrada123" })
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.errors.email).toEqual("Email not registered")
            }).catch(err => {
                fail(err);
            });
    });

    test("Deve impedir que um usuário receba o token de autenticação usando uma senha errada", () => {
        return request.post("/auth")
            .send({ email: mainUser.email, password: "senhaerrada123" })
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.errors.password).toEqual("Password is wrong")
            }).catch(err => {
                fail(err);
            });
    });
});