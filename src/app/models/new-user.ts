export interface NewUser {
    readonly id?: number; // معرف المستخدم (اختياري عند التسجيل لأول مرة)
        username: string;
        email: string;
        nickname: string;
        password: string;
        role?: 'admin' | 'user' | 'moderator'; 

      
}
