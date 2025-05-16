import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AddSubscriptionForm from "../../components/Subscription/AddSubscriptionForm";
import SubscriptionList from "../../components/Subscription/SubscriptionList";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import toast from "react-hot-toast";

const Subscriptions = () => {
  useUserAuth();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDel, setOpenDel] = useState({ show:false, id:null });

  const fetchSubs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_ALL);
      setSubs(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleAdd = async (sub) => {
    try {
      await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.ADD, sub);
      toast.success("Subscription added");
      setOpenAdd(false);
      fetchSubs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.SUBSCRIPTIONS.DELETE(id));
      toast.success("Subscription deleted");
      setOpenDel({ show:false, id:null });
      fetchSubs();
    } catch {
      toast.error("Error deleting");
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  return (
    <DashboardLayout activeMenu="Subscriptions">
      <div className="my-5 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Subscriptions</h3>
          <button className="add-btn" onClick={()=>setOpenAdd(true)}>
            Add Subscription
          </button>
        </div>

        <SubscriptionList subscriptions={subs} onDelete={(id)=>setOpenDel({show:true,id})} />

        <Modal isOpen={openAdd} onClose={()=>setOpenAdd(false)} title="Add Subscription">
          <AddSubscriptionForm onAdd={handleAdd} />
        </Modal>

        <Modal isOpen={openDel.show} onClose={()=>setOpenDel({show:false,id:null})} title="Delete Subscription">
          <DeleteAlert content="Are you sure?" onDelete={()=>handleDelete(openDel.id)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;