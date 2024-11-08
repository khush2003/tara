import React from 'react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';


interface LogoutModalProps {
  isVisible: boolean;
  onClose: () => void;
 
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isVisible, onClose }) => {
  const logOut  = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logOut();
    navigate("/");
    onClose();
  }

  return (

    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700">Logout Confirmation</DialogTitle>
          <DialogDescription className="text-purple-600">
            Are you sure you want to log out? Your progress will be saved!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2"
          >
            Yes, Log me out
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-purple-300 text-purple-700 hover:bg-purple-100 rounded-full px-6 py-2"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
