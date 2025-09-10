import React, { useState } from "react";
import axios from "axios";

const API_KEY =
  process.env.REACT_APP_KLIPY_KEY ||
  "QE4eFLlyLYo5GpWgrwgmKLojHdUZh9K5Ys8fJUmBO77H5G2xUFAzmxk2WiHDuMWf";
const BASE = "https://api.klipy.com/api/v1";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);

  const getCustomerId = () => {
    let customerId = localStorage.getItem('klipy_customer_id');
    if (!customerId) {
      customerId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('klipy_customer_id', customerId);
    }
    return customerId;
  };

  const fetchGifs = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setGifs([]);
    setSelectedGif(null);

    try {
      const customerId = getCustomerId();
      const endpoint = `${BASE}/${API_KEY}/gifs/search?q=${encodeURIComponent(
        query.trim()
      )}&per_page=12&customer_id=${customerId}&content_filter=medium&locale=en`;
      
      const res = await axios.get(endpoint);

      const gifData = res.data?.data?.data || [];
      
      const mapped = gifData.map((gif, i) => {
        // Extract GIF URL from the correct structure
        let url = null;
        
        if (gif.file?.hd?.gif?.url) {
          url = gif.file.hd.gif.url;
        } else if (gif.file?.md?.gif?.url) {
          url = gif.file.md.gif.url;
        } else if (gif.file?.sm?.gif?.url) {
          url = gif.file.sm.gif.url;
        } else if (gif.file?.xs?.gif?.url) {
          url = gif.file.xs.gif.url;
        }

        // Also get MP4 URL for better performance (optional)
        let mp4Url = null;
        if (gif.file?.hd?.mp4?.url) {
          mp4Url = gif.file.hd.mp4.url;
        } else if (gif.file?.md?.mp4?.url) {
          mp4Url = gif.file.md.mp4.url;
        } else if (gif.file?.sm?.mp4?.url) {
          mp4Url = gif.file.sm.mp4.url;
        }

        return {
          id: gif.id || i,
          url: url,
          mp4Url: mp4Url,
          title: gif.title || `GIF ${i}`,
          slug: gif.slug
        };
      });

      setGifs(mapped);
    } catch (err) {
      console.error("Error fetching gifs", err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  const shareGif = async (gif) => {
    try {
      const shareUrl = gif.url || `https://klipy.com/gif/${gif.slug || gif.id}`;
      await navigator.clipboard.writeText(shareUrl);
      alert("GIF link copied!");
    } catch {
      alert("Failed to copy GIF link");
    }
  };

  const selectGif = (gif) => {
    setSelectedGif(gif);
  };

  const clearSelectedGif = () => {
    setSelectedGif(null);
  };

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h2>Klipy GIF Search</h2>
      
      {/* Selected GIF Display */}
      {selectedGif && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          flexDirection: "column"
        }}>
          <button 
            onClick={clearSelectedGif}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 20,
              cursor: "pointer",
              zIndex: 1001
            }}
          >
            ×
          </button>
          
          {/* Use video for MP4 or img for GIF */}
          {selectedGif.mp4Url ? (
            <video 
              autoPlay 
              loop 
              muted
              playsInline
              style={{ 
                maxWidth: "90%", 
                maxHeight: "80%",
                objectFit: "contain"
              }}
            >
              <source src={selectedGif.mp4Url} type="video/mp4" />
              <img src={selectedGif.url} alt={selectedGif.title} />
            </video>
          ) : (
            <img
              src={selectedGif.url}
              alt={selectedGif.title}
              style={{ 
                maxWidth: "90%", 
                maxHeight: "80%",
                objectFit: "contain"
              }}
            />
          )}
          
          <div style={{ 
            color: "white", 
            marginTop: 16,
            fontSize: 18,
            textAlign: "center"
          }}>
            {selectedGif.title}
          </div>
          
          <button
            style={{
              marginTop: 12,
              padding: "8px 16px",
              fontSize: 14,
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 4
            }}
            onClick={() => shareGif(selectedGif)}
          >
            Copy Link
          </button>
        </div>
      )}
      
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search GIFs (e.g. cats)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchGifs()}
          style={{ padding: 8, width: 260, marginRight: 8 }}
        />
        <button onClick={fetchGifs} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {gifs.length === 0 && !loading && (
          <div style={{ opacity: 0.6 }}>No GIFs yet. Try searching!</div>
        )}
        {gifs.map((g) => (
          <div
            key={g.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 6,
              textAlign: "center",
              cursor: g.url ? "pointer" : "default"
            }}
            onClick={() => g.url && selectGif(g)}
          >
            {g.url ? (
              <>
                {/* Use video for MP4 for better performance */}
                {g.mp4Url ? (
                  <video 
                    autoPlay 
                    loop 
                    muted
                    playsInline
                    style={{ 
                      width: "100%", 
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: 6 
                    }}
                  >
                    <source src={g.mp4Url} type="video/mp4" />
                    <img src={g.url} alt={g.title} />
                  </video>
                ) : (
                  <img
                    src={g.url}
                    alt={g.title}
                    style={{ 
                      width: "100%", 
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: 6 
                    }}
                    onError={(e) => {
                      console.log('Image failed to load:', g.url);
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.image-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                )}
                <div className="image-fallback" style={{ 
                  display: 'none',
                  fontSize: 12, 
                  color: "#777",
                  height: "120px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}>
                  <div>Image failed to load</div>
                  <div style={{ fontSize: 10, marginTop: 4 }}>URL: {g.url.substring(0, 30)}...</div>
                </div>
              </>
            ) : (
              <div style={{ 
                fontSize: 12, 
                color: "#777",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                No URL found
              </div>
            )}
            <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
              {g.title}
            </div>
            <button
              style={{
                marginTop: 6,
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                shareGif(g);
              }}
              disabled={!g.url}
            >
              {g.url ? "Copy Link" : "No Link"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}