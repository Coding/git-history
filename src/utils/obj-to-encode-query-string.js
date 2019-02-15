export default (obj, prefix = '?') => {
    const queryString = Object.keys(obj)
        .map(key => `${key}=${encodeURIComponent(obj[key] || '')}`)
        .join('&');
    return queryString ? prefix + queryString : '';
}