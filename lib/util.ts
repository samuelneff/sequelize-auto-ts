

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

export function arrayToDictionary<T>(array:T[], key:any):Dictionary<T> {
    var d:Dictionary<T> = {};
    var keyFn:(t:T) => string;

    if (typeof key === 'string') {
        keyFn = function(t:T):string {
            return t[key];
        }
    } else {
        keyFn = key;
    }
    array.forEach(item => d[keyFn(item)] = item);

    return d;
}
