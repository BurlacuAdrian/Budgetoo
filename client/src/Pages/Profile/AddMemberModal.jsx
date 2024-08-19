import react, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const AddMemberModal = ({closeModal, data, setData}) => {

  const [email, setEmail] = useState('');

  const handleSaveButton = async () => {
    Swal.fire({
      title: 'Sending invitation...',
      text: 'Please wait while the invitation is being sent.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const success = await data.API.sendInvite(email);
      
      closeModal();
      
      if (success === true) {
        Swal.fire('Invitation has been sent', '', 'success');
      } else {
        Swal.fire('Invitation error', '', 'error');
      }
    } catch (error) {
      Swal.fire('Something went wrong', 'Please try again later.', 'error');
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
    <div className="bg-white p-6 rounded shadow-lg w-96 z-20">
      <h2 className="text-xl mb-4">Invite a new user to budget together!</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Their email address
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>


      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
        >
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSaveButton}>
          Save
        </button>
      </div>
    </div>
  </div>
  )
}

export default AddMemberModal