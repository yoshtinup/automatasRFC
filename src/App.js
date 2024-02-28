import React, { useState } from 'react';
import "../node_modules/primeflex/primeflex.css";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


import 'primereact/resources/themes/lara-light-indigo/theme.css';

class Automaton {
    constructor() {
        this.states = [0, 1, 2, 3, 4];
        this.final_states = [3];
        this.alphabet = ['G', 'U', 'P', 'Y', 'g', 'u', 'p', 'y'];
        this.transition_table = {
            
            '0-g': 1, '0-G': 1, '1-g': 1, '1-G': 1,
            '1-u': 2, '1-U': 2, '2-u': 2, '2-U': 2,
            '2-p': 3, '2-P': 3, '3-p': 3, '3-P': 3,
            '3-y': 4, '3-Y': 4, '4-y': 4, '4-Y': 4,
            '1-u': 2, '1-U': 2, '1-p': 3, '1-P': 3, '1-y': 4, '1-Y': 4,
            '2-g': 1, '2-G': 1, '2-p': 3, '2-P': 3, '2-y': 4, '2-Y': 4,
            '3-g': 1, '3-G': 1, '3-u': 2, '3-U': 2, '3-y': 4, '3-Y': 4,
            '4-g': 1, '4-G': 1, '4-u': 2, '4-U': 2, '4-p': 3, '4-P': 3
        };
        
        this.current_state = 0;
    }
  
    transition_to_state_with_input(input_value) {
        const key = `${this.current_state}-${input_value}`;
        if (!(key in this.transition_table)) {
            this.current_state = null;
        } else {
            this.current_state = this.transition_table[key];
        }
    }
  
    in_accept_state() {
        return this.final_states.includes(this.current_state);
    }
  
    go_to_initial_state() {
        this.current_state = 0;
    }
  
    run_with_input_list(input_list) {
        this.go_to_initial_state();
        const highlightedLetters = [];
        let gEncountered = false;
    
        for (const inp of input_list.toUpperCase()) { // Convertir la entrada a mayúsculas
            this.transition_to_state_with_input(inp);
            if (this.current_state === null) {
                highlightedLetters.push({ letter: inp, isValid: false });
                return { valid: false, highlightedLetters };
            }
            highlightedLetters.push({ letter: inp, isValid: true });
    
            if (inp === 'G') { // Ya no es necesario convertir a mayúsculas aquí
                gEncountered = true;
            }
        }
    
        if (!gEncountered) {
            return { valid: false, highlightedLetters };
        }
    
        return { valid: this.in_accept_state(), highlightedLetters };
    }
    
  }
  
  

function DFAComponent() {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [highlightedLetters, setHighlightedLetters] = useState([]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
      const dfa = new Automaton();
      const { highlightedLetters: highlightedLettersResult } = dfa.run_with_input_list(inputValue);
  
      let isAllValid = true; // Variable para rastrear si todas las letras son válidas
  
      for (const letterObj of highlightedLettersResult) {
          if (!letterObj.isValid) {
              isAllValid = false; // Si alguna letra no es válida, establece la bandera en falso y rompe el bucle
              break;
          }
      }
  
      if (isAllValid) {
          setResult(`LA CADENA ES CORRECTA AL DFA`);
      } else {
          setResult(`ES INCORRECTA LA CADENA`);
      }
      setHighlightedLetters(highlightedLettersResult);
    };

    return (
      <>
      <div className="pt-5">
        <div className=" flex align-items-center justify-content-center">
          <div className="text-center p-3 border-round-sm bg-primary font-bold border-500 hover:border-700 border-3 border-round surface-overlay font-bold m-2" style={{ minWidth: 300, minHeight: 250 }}>
          <p className="text-color mt-0">YOSHTIN GERMAN GUTIERREZ PEREZ</p>
            <p className="text-color mt-0">INGRESE CADENA</p>
            <p className="text-color mt-0">RFC = GUPY </p>

            <div className="static bottom-0 left-0  border-round p-4 font-bold " style={{ minWidth: 120, minHeight: 70 }}>
              <div className="p-inputgroup flex-1">
                <Button label="EVALUAR" onClick={handleSubmit}/>
                <InputText placeholder="Cadena" value={inputValue} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>

        <div className=" flex align-items-center justify-content-center">
          <div className=" text-center bg-white p-3 border-round-sm font-bold border-500 hover:border-700 border-3 border-round m-2" style={{ minWidth: 1300, minHeight: 150 }}>
            <p className='text-color'>{result}</p>
            <div className="static bottom-0 left-0  border-round p-4 font-bold " style={{ minWidth: 120, minHeight: 70 }}>
            <div className="static bottom-0 left-0  border-round p-4 font-bold " style={{ position: 'relative' }}>
            <div className='flex align-items-center justify-content-center text-3xl' style={{ position: 'relative', height: '80px' }}>
                {highlightedLetters.map((letterObj, index) => (
                    <React.Fragment key={index}>
                        <span style={{ display: 'inline-block', position: 'absolute', left: `${100 * index}px`, marginLeft: '-40px', borderRadius: '50%', width: '80px', height: '80px', textAlign: 'center', lineHeight: '80px', background: letterObj.isValid ? 'green' : 'red', color: 'white', fontWeight: 'bold' }}>
                            {letterObj.letter}
                        </span>
                        {index < highlightedLetters.length - 1 && (
                            <svg style={{ position: 'absolute', left: `${100 * index + 40}px`, top: '20px' }} width="80" height="40">
                                <line x1="0" y1="20" x2="80" y2="20" style={{ stroke: 'black', strokeWidth: '2' }} />
                                <polygon points="80,20 75,15 75,25" style={{ fill: 'black' }} />
                            </svg>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
            </div>
          </div>
        </div>
      </div>
      
      </>     

    );
}

export default DFAComponent;

