import { erewhonProfiles } from "../data/erewhon-profiles";
import { erewhonPhotos } from "../data/erewhon-menu";
import type { Spot } from "../data/spots";

interface Props {
  spot: Spot;
  onClose: () => void;
}

export default function ErewhonProfile({ spot, onClose }: Props) {
  const profile = erewhonProfiles[spot.name];
  const photo = erewhonPhotos[spot.name];

  if (!profile) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>
          &times;
        </button>

        {photo && (
          <div className="profile-hero">
            <img src={photo} alt={profile.name} />
            <div className="profile-hero-overlay">
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-tagline">{profile.tagline}</p>
            </div>
          </div>
        )}

        {!photo && (
          <div className="profile-header-plain">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-tagline">{profile.tagline}</p>
          </div>
        )}

        <div className="profile-body">
          <div className="profile-meta">
            <span className="profile-meta-item">
              <strong>Opened</strong> {profile.opened}
            </span>
            <span className="profile-meta-item">
              <strong>Highlight</strong> {profile.highlight}
            </span>
            <span className="profile-meta-item">
              <strong>Rating</strong> {spot.rating} ({spot.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className="profile-section">
            <h3>About This Location</h3>
            <p>{profile.description}</p>
          </div>

          <div className="profile-section">
            <h3>The Vibe</h3>
            <p>{profile.vibe}</p>
          </div>

          {profile.design && profile.design !== "Details not yet available." && (
            <div className="profile-section">
              <h3>The Space</h3>
              <p>{profile.design}</p>
            </div>
          )}

          <div className="profile-section">
            <h3>What to Get</h3>
            <div className="profile-menu">
              {profile.menu.map((item) => (
                <div key={item.name} className="profile-menu-item">
                  <span className="profile-menu-emoji">{item.emoji}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-tip">
            <strong>Tip:</strong> {profile.tip}
          </div>

          <p className="profile-address">{spot.address}</p>
        </div>
      </div>
    </div>
  );
}
