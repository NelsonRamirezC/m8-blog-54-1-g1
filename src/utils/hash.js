import bcrypt from 'bcrypt';

export const generarHash = (password) => {
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    return hash
};


export const decodificarHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}