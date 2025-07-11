import React, { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { Button } from '../ui/Button';
import { XCircle } from 'lucide-react';

interface Props{
    isOpen: boolean; // Indicates if the modal is open
    onClose: () => void; // Callback function to close the modal
}

interface NewProductForm {
    name: string;
    category: string;
    stock: number;
    price: number;
    image: File | null;
}

export const AddProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState<NewProductForm>({
        name: '',
        category: '',
        stock: 0,
        price: 0,
        image: null as File | null,
    });

    const { addProduct } = useInventory();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        let newValue: string | number | File | null = value;

        if(type == 'file') {
            newValue = files ? files[0] : null;
        }else if(type === 'number') {
            newValue = parseFloat(value);
        }

        setForm((prevForm) =>({
            ...prevForm, 
            [name]: newValue,
        }));
    };

    if (!isOpen)
        return null;
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md'>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Product</h2>
                <div className="space-y-4">

                    <div className='w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center cursor-pointer text-gray-500 text-sm'
                        onClick={() => document.getElementById('imageUpload')?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if(file) {
                                setForm(prev => ({ ...prev, image: file }));
                            }
                        })}>
                        
                        {form.image ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img 
                                    src={URL.createObjectURL(form.image)} 
                                    alt='Preview'
                                    className='max-h-full max-w-full object-contain rounded'/>
                                <button 
                                    type='button'
                                    onClick={() => setForm(prev => ({...prev, image: null }))}
                                    className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                                    aria-label='Remove image'
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        ) : 
                            (<span>Click or drag image here
                                <input
                                    type="file"
                                    id="imageUpload"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                    />
                            </span>
                            )};
                        
                    </div>

                    <input 
                        type='text' 
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        placeholder='Product Name'
                        className='w-full p-2 border rounded' />
                    <input 
                        type='text' 
                        name='category'
                        value={form.category}
                        placeholder='Category'
                        onChange={handleChange}
                        className='w-full p-2 border rounded' />
                    <input 
                        type='number' 
                        name='stock' 
                        value={form.stock}
                        placeholder='Stock'
                        onChange={handleChange}
                        className='w-full p-2 border rounded' />
                    <input 
                        type='number' 
                        name='price' 
                        value={form.price}
                        placeholder='Price'
                        onChange={handleChange}
                        className='w-full p-2 border rounded' />
                </div>
            
                <div className="flex justify-end space-x-2 mt-4">
                
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>

                <Button variant="primary" onClick={() => {
                    addProduct({
                        name: form.name,
                        category: form.category,
                        quantity: form.stock,
                        price:form.price,
                        // Image is ignored by now there is no back end
                    });
                    setForm({
                        name: '',
                        category: '',
                        stock: 0,
                        price: 0,
                        image: null,
                    });
                    console.log(form); // luego se cambia por addProduct()
                    onClose();
                }}>
                    Add
                </Button>
                </div>
            </div>
        </div>
    );
};
