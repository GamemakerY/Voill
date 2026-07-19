
export async function validateAPIKey(APIKey:string): Promise<boolean>{
    if(!APIKey.startsWith("gsk_")){
        return false;
    }
    //have backend check later, just a quick one for now
    else{
        try {
            const url = 'http://localhost:8000/testAPIKey';
            const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'APIKey': APIKey
                    }
                    }
            );

        if (response.ok){
            const data = await response.json();
            return data
        }
        return false
    }
    catch(error){
        //Add these cases later
        console.error("Backend unreachable: ", error);
        return false;
    }



    }

            
            
}
            