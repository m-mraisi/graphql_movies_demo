export const UserSchema = `#graphql

    input SignupInput {
    userName:String
    email:String
    password:String
    }
    input LoginInput {
    email:String
    password:String
    }

    input ChangePassInput {
    email:String
    oldPassword:String
    newPassword:String
    }

    type JwtToken{
        token:String!
    }

    type AuthUser{
        id:Int
        userName:String
        email:String
        token:JwtToken
    }

    type Query{
        user(id:ID!):User!
    }

    type Mutation{
        signUp(user:SignupInput):AuthUser
        login(user:LoginInput):AuthUser
        changePassword(changePassInput:ChangePassInput):AuthUser
    }

`;
