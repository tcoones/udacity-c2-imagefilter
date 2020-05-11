export const config = {
    "dev": {
      "aws_region": "us-east-2",
      "aws_profile": "default"
    },
    "prod": {

    },
    "jwt":{
      "secret":process.env.JWT_SECRET
    }
  }
  