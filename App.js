// App.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { api } from './src/services/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = criando, objeto = editando

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setEditingTask(null);
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Validação', 'O título é obrigatório.');
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
    };

    try {
      setSaving(true);

      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      await loadTasks();
      resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitulo(task.titulo);
    setDescricao(task.descricao || '');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/tasks/${id}`);
              await loadTasks();
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.titulo}</Text>
        {item.descricao ? (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        ) : null}
      </View>

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={[styles.smallButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.smallButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.smallButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.smallButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>CRUD de Tarefas</Text>

        {/* FORMULÁRIO */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>

          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Título da tarefa"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição da tarefa (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />

          <View style={styles.formButtonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {editingTask ? 'Atualizar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

            {editingTask && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* LISTA */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Tarefas cadastradas</Text>
          {loading && <ActivityIndicator />}
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && (
              <Text style={styles.emptyText}>
                Nenhuma tarefa cadastrada ainda.
              </Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  formButtonsRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#16A34A',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  taskActions: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 6,
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#2563EB',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  smallButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
  },
});
