const urls = [
    "http://example.com/one",
    "http://example.com/two",
    "http://example.com/three",
    "https://secure.example.com",
];

export const insecure = urls.filter((url) => url.startsWith("http://"));
