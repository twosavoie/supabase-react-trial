import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "../Avatar";
import PropTypes from "prop-types";

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  Account.propTypes = {
    session: PropTypes.object.isRequired,
  };

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <div className="account-form-widget">
      <h1>Account</h1>
      <p>
        You don&apos;t need to complete any of this information to use Pebli.
      </p>
      <form onSubmit={updateProfile} className="form-widget">
        <div className="account-form-widget-elements">
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div className="account-form-widget-elements">
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="account-form-widget-elements">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(event, url) => {
            updateProfile(event, url);
          }}
        />

        <div className="account-form-widget-elements account-form-buttons">
          {/* TODO: Add message that account has been updated */}
          <button
            className="button block primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
          {/* * adding button here */}
          <button
            className="button block"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>

        {/* <div className="account-form-widget-elements">
          <button
            className="button block"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div> */}
      </form>
    </div>
  );
}
