import React, { useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import SketchyAlert from "./SketchyAlert";
import {trackEvent} from "../Utils/analytics";
import "../Styles/FABInvite.css"; // sketchy styles here

const InviteFAB = () => {
  const [inviteInput, setInviteInput] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleRedeemCode = async () => {
    trackEvent({
    action: 'button_click',
    category: 'FAB',
    label: 'Invite FAB Button',
  });
    if (!inviteInput.trim()) return;
    setIsRedeeming(true);

    const { data: invite, error } = await supabase
      .from("invites")
      .select("sender_id")
      .eq("code", inviteInput.trim().toUpperCase())
      .single();

    if (error || !invite) {
      setAlertMessage({
        text: "❌ Invalid or expired invite code.",
        withButton: true,
      });
      setIsRedeeming(false);
      return;
    }

    const senderId = invite.sender_id;

    // 🛑 Prevent self-redeem
    if (senderId === currentUser.id) {
      setAlertMessage({
        text: "❌ You cannot use your own invite code.",
        withButton: true,
      });
      setIsRedeeming(false);
      return;
    }
    const { data: existingGift, error: existingGiftError } = await supabase
      .from("gifts")
      .select("id")
      .eq("sender_id", senderId)
      .eq("receiver_id", currentUser.id)
      .maybeSingle();

    if (existingGift && !existingGiftError) {
      setAlertMessage({
        text: "❌ You already used an invite code.",
        withButton: true,
      });
      setIsRedeeming(false);
      return;
    }
    const { data: sender, error: senderError } = await supabase
      .from("users")
      .select("reward_coins")
      .eq("id", senderId)
      .single();

    if (senderError || !sender) {
      setAlertMessage({ text: "❌ Couldn't find inviter.", withButton: true });
      setIsRedeeming(false);
      return;
    }
    try {
      // Reward inviter (sender) with 50 coins
      const { error: inviterError } = await supabase.rpc(
        "increment_reward_coins",
        {
          user_id_input: senderId,
          increment_by: 50,
        }
      );

      if (inviterError) {
        //console.error("❌ RPC error:", inviterError);
        setAlertMessage({
          text: "❌ Failed to reward inviter or user.",
          withButton: true,
        });
      } else {
        //console.log("✅ Coins rewarded: 50 to inviter");
        setAlertMessage({
          text: "✅ Invite code accepted! Inviter rewarded with 50 coins.",
          withButton: true,
        });
        const { error: deleteError } = await supabase
          .from("invites")
          .delete()
          .eq("code", inviteInput.trim().toUpperCase());

        if (deleteError) {
          //console.error("⚠️ Failed to delete used code:", deleteError);
        }
        setInviteInput("");
        setShowPopup(false);
      }
    } catch (err) {
      //console.error("❗ Unexpected RPC error:", err);
    }

    setIsRedeeming(false);
  };

  return (
    <>
      {/* Sketchy Floating Button */}
      <button className="sketchy-fab" onClick={() => setShowPopup(true)}>
        <img
          src="https://cdn4.iconfinder.com/data/icons/free-glyph-christmas-icons/24/Present_Box_1-64.png"
          alt="Gift"
          style={{ width: "24px", height: "24px" }}
        />
      </button>

      {/* Sketchy Modal */}
      {showPopup && (
        <div className="sketchy-popup-overlay">
          <div className="sketchy-popup">
            <h3 className="sketchy-title">🔑 Enter Invite Code</h3>
            <input
              type="text"
              placeholder="Type code here"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              className="sketchy-input"
            />
            <div className="sketchy-btns">
              <button
                className="sketchy-btn"
                onClick={handleRedeemCode}
                disabled={isRedeeming}
              >
                {isRedeeming ? "🔄 Redeeming..." : "✅ Redeem"}
              </button>
              <button
                className="sketchy-btn cancel"
                onClick={() => setShowPopup(false)}
                disabled={isRedeeming}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <SketchyAlert
          message={alertMessage.text}
          withButton={alertMessage.withButton}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default InviteFAB;
