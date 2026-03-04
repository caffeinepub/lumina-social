import { useAuthContext } from "@/components/auth/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  LogIn,
  Plus,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface CentreAccount {
  username: string;
  displayName: string;
  avatarUrl: string;
  email: string;
}

const CENTRE_KEY = "lumina_accounts_centre";

function loadCentreAccounts(): CentreAccount[] {
  try {
    const stored = localStorage.getItem(CENTRE_KEY);
    if (stored) return JSON.parse(stored) as CentreAccount[];
  } catch {
    // ignore
  }
  return [];
}

function saveCentreAccounts(accounts: CentreAccount[]): void {
  try {
    localStorage.setItem(CENTRE_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export function AccountsCentrePage() {
  const { currentUser, login, updateUser } = useAuthContext();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<CentreAccount[]>(() => {
    const list = loadCentreAccounts();
    // Auto-add current user if not already in the list
    if (currentUser && !list.some((a) => a.username === currentUser.username)) {
      const entry: CentreAccount = {
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        email: currentUser.email,
      };
      const updated = [entry, ...list];
      saveCentreAccounts(updated);
      return updated;
    }
    return list;
  });

  const [addOpen, setAddOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSwitchAccount = (account: CentreAccount) => {
    if (account.username === currentUser?.username) return;
    // Try to load stored user for this account
    const success = login(account.email, "any"); // password stored in lumina_user per account
    if (!success) {
      // Set directly if email-based login fails
      updateUser({
        username: account.username,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        email: account.email,
      });
    }
    toast.success(`Switched to @${account.username}`);
    void navigate({ to: "/" });
  };

  const handleRemoveAccount = (username: string) => {
    if (username === currentUser?.username) {
      toast.error("Cannot remove your active account. Switch first.");
      return;
    }
    const updated = accounts.filter((a) => a.username !== username);
    setAccounts(updated);
    saveCentreAccounts(updated);
    toast.success("Account removed from centre");
  };

  const handleAddAccount = () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError("Enter username and password");
      return;
    }

    // Check if there's a stored user with this username
    try {
      const allUsersStr = localStorage.getItem("lumina_all_users");
      if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr) as Record<
          string,
          { username: string; displayName: string; avatarUrl: string }
        >;
        const found = allUsers[loginUsername.trim()];
        if (found) {
          const entry: CentreAccount = {
            username: found.username,
            displayName: found.displayName,
            avatarUrl: found.avatarUrl,
            email: `${found.username}@lumina.app`,
          };
          if (accounts.some((a) => a.username === entry.username)) {
            setLoginError("Account already in centre");
            return;
          }
          const updated = [...accounts, entry];
          setAccounts(updated);
          saveCentreAccounts(updated);
          setAddOpen(false);
          setLoginUsername("");
          setLoginPassword("");
          setLoginError("");
          toast.success(`@${entry.username} added to Accounts Centre`);
          return;
        }
      }
    } catch {
      // ignore
    }

    setLoginError(
      "Account not found. Make sure it's been created on this device.",
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/settings">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-white">Accounts Centre</h1>
      </div>

      <p className="text-sm text-white/50 mb-6">
        Manage and switch between multiple Lumina accounts on this device.
      </p>

      {/* Accounts list */}
      <div className="space-y-2 mb-6">
        {accounts.map((account, i) => {
          const isActive = account.username === currentUser?.username;
          return (
            <motion.div
              key={account.username}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              data-ocid={`accounts.item.${i + 1}`}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
              style={{
                background: isActive
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: isActive
                  ? "1px solid rgba(124,58,237,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ${isActive ? "ring-violet-500" : "ring-white/10"}`}
              >
                {account.avatarUrl ? (
                  <img
                    src={account.avatarUrl}
                    alt={account.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    }}
                  >
                    <UserCircle size={24} className="text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {account.displayName}
                </p>
                <p className="text-xs text-white/40 truncate">
                  @{account.username}
                </p>
              </div>

              {/* Active badge or switch button */}
              {isActive ? (
                <div className="flex items-center gap-1.5 text-violet-400 text-xs font-medium">
                  <CheckCircle size={16} />
                  Active
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchAccount(account)}
                    data-ocid="accounts.primary_button"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white transition-all hover:opacity-80"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    }}
                  >
                    <LogIn size={12} />
                    Switch
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        data-ocid="accounts.delete_button"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        aria-label="Remove account"
                      >
                        <X size={14} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="border-white/10"
                      style={{
                        background: "rgba(14,14,20,0.97)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Remove @{account.username}?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white/50">
                          This will remove the account from your Accounts
                          Centre. Your account data won't be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveAccount(account.username)}
                          className="bg-destructive text-white hover:bg-destructive/80"
                          data-ocid="accounts.confirm_button"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </motion.div>
          );
        })}

        {accounts.length === 0 && (
          <div
            className="text-center py-10 text-white/30 rounded-2xl"
            data-ocid="accounts.empty_state"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <UserCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No accounts added yet</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          data-ocid="accounts.primary_button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #db2777)",
          }}
        >
          <Plus size={16} />
          Add Existing Account
        </button>

        <Link to="/signup">
          <button
            type="button"
            data-ocid="accounts.secondary_button"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white/70 transition-all hover:text-white"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <UserPlus size={16} />
            Create New Account
          </button>
        </Link>
      </div>

      {/* Add account dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="border-white/10 max-w-sm"
          data-ocid="accounts.dialog"
          style={{
            background: "rgba(14,14,20,0.97)",
            backdropFilter: "blur(24px)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <LogIn size={16} className="text-violet-400" />
              Add Account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label
                htmlFor="ac-username"
                className="block text-xs text-white/50 mb-1.5"
              >
                Username
              </label>
              <input
                id="ac-username"
                type="text"
                placeholder="@username"
                value={loginUsername}
                onChange={(e) => {
                  setLoginUsername(e.target.value);
                  setLoginError("");
                }}
                data-ocid="accounts.input"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 16,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="ac-password"
                className="block text-xs text-white/50 mb-1.5"
              >
                Password
              </label>
              <input
                id="ac-password"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginError("");
                }}
                className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 16,
                }}
              />
            </div>

            {loginError && (
              <p
                className="text-xs text-red-400"
                data-ocid="accounts.error_state"
              >
                {loginError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAddOpen(false);
                  setLoginError("");
                  setLoginUsername("");
                  setLoginPassword("");
                }}
                data-ocid="accounts.cancel_button"
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAccount}
                data-ocid="accounts.submit_button"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                }}
              >
                Add Account
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <p className="text-center text-xs text-white/20 py-6">
        © {new Date().getFullYear()} Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/40 transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
