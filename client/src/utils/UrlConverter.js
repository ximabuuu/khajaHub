export const UrlConverter = (name)=>{
    const url = name.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}