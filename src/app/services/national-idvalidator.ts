

export enum Gender{
    Male=1,
    Female=2
}
export class NationalIDValidator
{
    public validateNid(nid:string):boolean{
        var pattern = /^(2|3)[0-9][0-9][0-1][0-9][0-3][0-9](01|02|03|04|05|06|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d$/;
        var result = pattern.test(nid);
        if (result) {
            for (var a = nid.substring(13, 14), n = nid.substring(0, 13), i = 0, u = n.length - 1, l = 2; u >= 0;) 8 == l && (l = 2), i += l * parseInt(n.substring(u, u + 1)), u -= 1, l += 1;
            var f = 11 - (i%11);
            if (f > 9) { (f -= 10) };
            result = (parseInt(a) == f)
            }
        return result;
    }

    public getGenderFromNid(nid:string):Gender{
        var genderIdentifiernid=nid.substr(12,1);
        var result:number=+genderIdentifiernid;
        if(result%2==0)
            return Gender.Female;
        else
            return Gender.Male;
    }

    public getBirthDateFromNid(nid:string):string{
        var result=nid.substr(0,1)=="2"?"19":"20";
        result+=nid.substr(1,2)+"-";
        result+=nid.substr(3,2)+"-";
        result+=nid.substr(5,2)+"T00:00:00";
        return result;
    }
}