import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { config } from '@/config/environment';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ContactMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messagesRaw, isLoading } = useQuery({
    queryKey: ['admin-contact-messages'],
    queryFn: async () => {
      const res = await api.get(`${config.backend.url}/contact`);
      return res.data;
    }
  });
  const messages = Array.isArray(messagesRaw) ? messagesRaw : [];

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${config.backend.url}/contact/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-messages'] });
      toast({ title: 'Deleted' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err?.message || 'Failed to delete', variant: 'destructive' });
    }
  });

  return (
    <div>
      <h3 className="text-2xl font-bold text-hotel-navy mb-4">Contact Messages</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {messages.length === 0 && <p>No messages yet.</p>}
          {messages.map((m: any) => (
            <div key={m.id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{m.first_name} {m.last_name}</div>
                  <div className="text-sm text-gray-600">{m.email} · {m.phone || 'N/A'}</div>
                  <div className="mt-2 text-gray-800"><strong>Subject:</strong> {m.subject}</div>
                  <div className="mt-2 text-gray-700 whitespace-pre-wrap">{m.message}</div>
                </div>
                <div>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate(m.id)}>Delete</Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
