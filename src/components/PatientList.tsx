import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AddPatientForm from './AddPatientForm';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const queryClient = useQueryClient();

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  const addPatientMutation = useMutation({
    mutationFn: async (newPatient: Omit<Patient, 'id'>) => {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  const handleAddPatient = (newPatient: Omit<Patient, 'id'>) => {
    addPatientMutation.mutate(newPatient);
    setIsAddPatientOpen(false);
  };

  const filteredPatients = patients.filter((patient: Patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error loading patients: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddPatientOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>
      {isLoading ? (
        <p>Loading patients...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <AddPatientForm
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
}