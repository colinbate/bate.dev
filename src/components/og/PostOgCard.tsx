/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

type PostOgCardProps = {
    title: string;
    thumbnailSrc?: string;
    faviconSrc: string;
};

export function PostOgCard({
    title,
    thumbnailSrc,
    faviconSrc,
}: PostOgCardProps) {
    return (
        <div
            style={{
                width: "1200px",
                height: "630px",
                display: "flex",
                padding: "48px",
                background: "#09090b",
                color: "#fafafa",
                gap: thumbnailSrc ? "48px" : "0",
                boxSizing: "border-box",
                alignItems: "center",
                fontFamily: "Recursive",
            }}
        >
            {thumbnailSrc ? (
                <div
                    style={{
                        width: "420px",
                        height: "420px",
                        borderRadius: "24px",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
                    }}
                >
                    <img
                        src={thumbnailSrc}
                        width="420"
                        height="420"
                        style={{
                            width: "420px",
                            height: "420px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            ) : null}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: thumbnailSrc ? "24px" : "32px",
                    flex: 1,
                    minWidth: 0,
                    height: thumbnailSrc ? "420px" : "100%",
                }}
            >
                <div
                    style={{
                        fontSize: thumbnailSrc ? "64px" : "86px",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        letterSpacing: "0",
                        display: "-webkit-box",
                        WebkitLineClamp: thumbnailSrc ? 3 : 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        fontSize: "28px",
                        lineHeight: 1,
                        fontWeight: 500,
                        color: "#facc15",
                    }}
                >
                    <img
                        src={faviconSrc}
                        width="32"
                        height="32"
                        style={{ width: "32px", height: "32px" }}
                    />
                    <span>bate.dev</span>
                </div>
            </div>
        </div>
    );
}
