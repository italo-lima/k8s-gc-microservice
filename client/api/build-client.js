import axios from "axios"

const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    
    return axios.create({
      baseURL: 'www.i3odev.com',
      headers: req.headers
    })
  } else {
    return axios.create({
      baseURL: '/'
    })
  }
}

export default BuildClient