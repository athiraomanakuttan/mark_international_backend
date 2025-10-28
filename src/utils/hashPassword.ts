import bcrypt from 'bcryptjs'
export const hashPassword =async  (password: string, salt=10)=>{
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

export const comparePassword = async (password: string, originalPassword: string)=>{
    return await bcrypt.compare(password, originalPassword)
}