import bcrypt from 'bcrypt';

const saltRounds = 12;
const password = '123456';

const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);

console.log(hash);

export const decodificarHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

console.log(decodificarHash("123456", hash));