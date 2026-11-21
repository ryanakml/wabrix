export default {
  async fetch(request: any, env: any): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1) || "wabrix-demo.mp4";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const rangeHeader = request.headers.get("range");

    const object = await env.MEDIA_BUCKET.get(key, {
      range: rangeHeader ? request.headers : undefined,
      onlyIf: request.headers,
    });

    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Content-Type", "video/mp4");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Accept-Ranges", "bytes");

    if (rangeHeader && object.range) {
      const { offset, length } = object.range;
      headers.set("Content-Range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
      headers.set("Content-Length", `${length}`);
      return new Response(object.body, { status: 206, headers });
    }

    headers.set("Content-Length", `${object.size}`);
    return new Response(object.body, { status: 200, headers });
  },
};
