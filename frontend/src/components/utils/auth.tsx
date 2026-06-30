
export function validateAPIKey(APIKey:string){
    if(!APIKey.startsWith("gsk_")){
        return false;
    }
    //have backend check later, just a quick one for now
    else{
        return true;
    }
}