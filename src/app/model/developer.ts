export interface Developer{
        
        login: String;
        id: Number;
        avatar_url:String;
        name: String;
        public_repos: Number;
        followers: Number;
        created_at: String;


      
}

export interface Developers{
        items:[
                {
                        id:String;
                        login: String;
                        avatar_url:String;
                        created_at: String;
                        followers: Number;
                        public_repos: Number;
                }
        ]
}