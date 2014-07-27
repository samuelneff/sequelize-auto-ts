

export interface Dictionary<TValue>
{
    [key: string]: TValue;
}

export function camelCase(s:string):string {
    switch(s.length)
    {
        case 0:
            return '';

        case 1:
            return s.toLowerCase();

        default:
            return s.charAt(0).toLowerCase() + s.substr(1);
    }
}