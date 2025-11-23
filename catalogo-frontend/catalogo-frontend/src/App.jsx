import React, { useState, useEffect } from 'react';


const AUTH_HEADER = 'Basic YWRtaW46cGFzc3dvcmQ='; 
const API_BASE_URL = ''; 

function App() {
  const [autores, setAutores] = useState([]);
  const [livros, setLivros] = useState([]);
  const [cds, setCds] = useState([]);
  const [dvds, setDvds] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [newAutorNome, setNewAutorNome] = useState('');
  const [newAutorNacionalidade, setNewAutorNacionalidade] = useState('');
  

  const [newMediaTipo, setNewMediaTipo] = useState('livros'); 
  const [newMediaTitulo, setNewMediaTitulo] = useState('');
  const [newMediaAutorId, setNewMediaAutorId] = useState('');
  const [newMediaCampoExtra, setNewMediaCampoExtra] = useState('');

 

  const fetchAllMedia = async () => {
    try {
      setError(null); 
      setLoading(true);

      const endpoints = [
        { path: '/autores', setter: setAutores, name: 'autores', color: '#007bff' },
        { path: '/livros', setter: setLivros, name: 'livros', color: '#ff9800' },
        { path: '/cds', setter: setCds, name: 'cds', color: '#00bcd4' },
        { path: '/dvds', setter: setDvds, name: 'dvds', color: '#9c27b0' },
      ];

      const fetchPromises = endpoints.map(async ({ path, name }) => {
        const response = await fetch(`${API_BASE_URL}${path}`);
        if (!response.ok) {
          throw new Error(`Falha ao carregar ${name}! Status: ${response.status}`);
        }
        const data = await response.json();
        return { data, setter: endpoints.find(e => e.name === name).setter };
      });
      
      const results = await Promise.all(fetchPromises);

      results.forEach(result => result.setter(result.data));
      if (results[0].data.length > 0 && !newMediaAutorId) {
          setNewMediaAutorId(results[0].data[0]._id);
      }


    } catch (err) {
      console.error("Erro ao buscar dados da API:", err);
      setError(`Falha na comunicação com a API (Verifique o Servidor Node.js na porta 3000): ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMedia();
  }, []); 

 
  const handleCreateAutor = async (e) => {
    e.preventDefault(); 
    if (!newAutorNome || !newAutorNacionalidade) {
      alert("Por favor, preencha nome e nacionalidade.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/autores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_HEADER, 
        },
        body: JSON.stringify({
          nome: newAutorNome,
          nacionalidade: newAutorNacionalidade,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Falha na criação: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage += ` - ${errorData.error || response.statusText}`;
        } catch (e) {
            errorMessage += ` - Resposta de erro não-JSON.`;
        }
        throw new Error(errorMessage);
      }

      setNewAutorNome('');
      setNewAutorNacionalidade('');
      fetchAllMedia(); 
      setError(null);
    } catch (err) {
      setError(`Erro ao criar autor (Verifique as credenciais Basic Auth): ${err.message}`);
      console.error("Erro ao criar autor:", err);
    }
  };

 
  const handleCreateMedia = async (e) => {
    e.preventDefault(); 
    if (!newMediaTitulo || !newMediaAutorId || !newMediaCampoExtra) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    let body = { 
        titulo: newMediaTitulo,
        autor: newMediaAutorId,
    };
    
  
    if (newMediaTipo === 'livros') {
        body.preco = parseFloat(newMediaCampoExtra);
        if (isNaN(body.preco)) { alert("Preço deve ser um número."); return; }
    } else if (newMediaTipo === 'cds') {
        body.genero = newMediaCampoExtra;
    } else if (newMediaTipo === 'dvds') {
        body.duracao = parseInt(newMediaCampoExtra);
        if (isNaN(body.duracao)) { alert("Duração deve ser um número."); return; }
    }
    
    if (Object.keys(body).length < 3) {
         alert("Erro interno no formulário.");
         return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${newMediaTipo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_HEADER, 
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = `Falha na criação de ${newMediaTipo}: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage += ` - ${errorData.error || response.statusText}`;
        } catch (e) {
            errorMessage += ` - Resposta de erro não-JSON.`;
        }
        throw new Error(errorMessage);
      }

      setNewMediaTitulo('');
      setNewMediaCampoExtra('');
      fetchAllMedia(); 
      setError(null);
    } catch (err) {
      setError(`Erro ao criar mídia (Verifique se o Autor existe): ${err.message}`);
      console.error("Erro ao criar mídia:", err);
    }
  };


 
  const handleDeleteMedia = async (id, path) => {
    if (!window.confirm(`Tem certeza que deseja eliminar o item com ID ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}${path}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': AUTH_HEADER, 
            },
        });

        if (!response.ok) {
             throw new Error(`Falha ao eliminar! Status: ${response.status}`);
        }
        
        fetchAllMedia();
    } catch (err) {
        setError(`Erro ao eliminar item: ${err.message}. Verifique a consola.`);
        console.error("Erro ao eliminar:", err);
    }
  };

 
  const handleUpdateMedia = async (item, path, currentTitle) => {
    const newTitle = window.prompt(`Novo título para "${currentTitle}":`, currentTitle);
    
    if (!newTitle || newTitle === currentTitle) {
        return;
    }
    
    const updateField = item.nome ? { nome: newTitle } : { titulo: newTitle };

    try {
        const response = await fetch(`${API_BASE_URL}${path}/${item._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_HEADER, 
            },
            body: JSON.stringify(updateField),
        });

        if (!response.ok) {
             throw new Error(`Falha ao atualizar! Status: ${response.status}`);
        }
        
        fetchAllMedia();
    } catch (err) {
        setError(`Erro ao atualizar item: ${err.message}. Verifique a consola.`);
        console.error("Erro ao atualizar:", err);
    }
  };

 

  const MediaList = ({ title, items, itemType, borderColor, path }) => {
    const defaultText = `Nenhum ${itemType} encontrado.`;
    
    const getItemDetails = (item) => {
      const autorNome = item.autor && item.autor.nome ? item.autor.nome : 'Autor não populado/ID inválido';
      
      switch (itemType) {
        case 'autor':
          return <p>Nacionalidade: {item.nacionalidade}</p>;
        case 'livro':
          return (
            <>
              <p>Preço: R$ {item.preco ? item.preco.toFixed(2) : 'N/A'}</p>
              <p>Autor: {autorNome}</p>
            </>
          );
        case 'cd':
          return (
            <>
              <p>Gênero: {item.genero || 'N/A'}</p>
              <p>Autor/Artista: {autorNome}</p>
            </>
          );
        case 'dvd':
          return (
            <>
              <p>Duração: {item.duracao ? item.duracao + ' min' : 'N/A'}</p>
              <p>Autor/Diretor: {autorNome}</p>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <hr style={styles.hr} />
        <h2 style={styles.subHeader}>{title} ({items.length})</h2>
        {loading && !error ? (
          <p>A carregar...</p>
        ) : (
          <div style={styles.grid}>
            {items.length === 0 ? (
              <p>{defaultText}</p>
            ) : (
              items.map(item => (
                <div key={item._id} style={{ ...styles.card, borderLeftColor: borderColor }}>
                  <h3>{item.nome || item.titulo}</h3>
                  {getItemDetails(item)}
                  <p style={styles.meta}>ID: {item._id.substring(0, 8)}...</p>
                  <div style={styles.actions}>
                    
                    {}
                    <button 
                      onClick={() => handleUpdateMedia(item, path, item.nome || item.titulo)}
                      style={{ ...styles.actionButton, ...styles.updateButton }}
                    >
                      Editar
                    </button>
                    
                    {}
                    <button
                      onClick={() => handleDeleteMedia(item._id, path)}
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </>
    );
  };
  
 
  const getExtraFieldLabel = () => {
    if (newMediaTipo === 'livros') return 'Preço (R$)';
    if (newMediaTipo === 'cds') return 'Gênero Musical';
    if (newMediaTipo === 'dvds') return 'Duração (min)';
    return 'Valor Extra';
  };

 
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Catálogo</h1>

      {error && <p style={styles.errorMessage}>{error}</p>}
      
      {}
      <div style={styles.creationGrid}>
        
        {}
        <div style={styles.formContainer}>
          <h2 style={styles.subHeader}>1. Adicionar Autor/Autora</h2>
          <form onSubmit={handleCreateAutor} style={styles.form}>
            <input
              type="text"
              placeholder="Nome do Autor"
              value={newAutorNome}
              onChange={(e) => setNewAutorNome(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Nacionalidade"
              value={newAutorNacionalidade}
              onChange={(e) => setNewAutorNacionalidade(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>
               Adicionar Autor
            </button>
          </form>
        </div>

        {}
        <div style={styles.formContainer}>
          <h2 style={styles.subHeader}>2. Adicionar Mídia ({newMediaTipo})</h2>
          {autores.length === 0 ? (
            <p className="text-red-500">Crie um Autor primeiro para adicionar mídia!</p>
          ) : (
            <form onSubmit={handleCreateMedia} style={styles.form}>
              
              <select 
                value={newMediaTipo}
                onChange={(e) => setNewMediaTipo(e.target.value)}
                style={styles.input}
              >
                <option value="livros">Livro</option>
                <option value="cds">CD</option>
                <option value="dvds">DVD</option>
              </select>

              <select 
                value={newMediaAutorId}
                onChange={(e) => setNewMediaAutorId(e.target.value)}
                style={styles.input}
                required
              >
                <option value="" disabled>-- Selecione um Autor --</option>
                {autores.map(a => (
                    <option key={a._id} value={a._id}>{a.nome} ({a.nacionalidade})</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Título da Mídia"
                value={newMediaTitulo}
                onChange={(e) => setNewMediaTitulo(e.target.value)}
                style={styles.input}
                required
              />
              
              <input
                type={(newMediaTipo === 'livros' || newMediaTipo === 'dvds') ? 'number' : 'text'}
                placeholder={getExtraFieldLabel()}
                value={newMediaCampoExtra}
                onChange={(e) => setNewMediaCampoExtra(e.target.value)}
                style={styles.input}
                required
              />

              <button type="submit" style={{...styles.button, backgroundColor: '#17a2b8'}}>
                Adicionar {newMediaTipo.slice(0, -1)}
              </button>
            </form>
          )}
        </div>
      </div>

      <hr style={styles.hr} />
      
      {}
      <MediaList title="Autores Cadastrados" items={autores} itemType="autor" borderColor="#007bff" path="/autores"/>
      <MediaList title="Livros Cadastrados" items={livros} itemType="livro" borderColor="#ff9800" path="/livros"/>
      <MediaList title="CDs Cadastrados" items={cds} itemType="cd" borderColor="#00bcd4" path="/cds"/>
      <MediaList title="DVDs Cadastrados" items={dvds} itemType="dvd" borderColor="#9c27b0" path="/dvds"/>
    </div>
  );
}


const styles = {
  container: {
    fontFamily: 'Inter, Arial, sans-serif',
    padding: '20px',
    maxWidth: '1200px', 
    margin: '30px auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '30px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '15px',
  },
  subHeader: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '1.5em',
  },
  creationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px',
    '@media (maxWidth: 768px)': {
        gridTemplateColumns: '1fr',
    },
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  form: {
    display: 'flex',
    gap: '15px',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  },
  hr: {
    margin: '40px 0',
    border: '0',
    borderTop: '1px solid #ccc',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    borderLeft: '4px solid', 
  },
  actions: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer', 
    fontSize: '14px',
    opacity: 1,
  },
  updateButton: {
    backgroundColor: '#ffc107',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #f5c6cb',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  meta: {
    fontSize: '0.8em',
    color: '#777',
    marginTop: '5px',
  }
};


export default App;