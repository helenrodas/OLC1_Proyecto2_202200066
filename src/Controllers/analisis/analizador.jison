%{
// codigo de JS si fuese necesario
const Tipo = require('./simbolo/Tipo')
const Nativo = require('./expresiones/Nativo')
const Aritmeticas = require('./expresiones/Aritmeticas')
const AccesoVar = require('./expresiones/AccesoVar')

const Print = require('./instrucciones/Print')
const Declaracion = require('./instrucciones/Declaracion')
const AsignacionVar = require('./instrucciones/AsignacionVar')
%}

// analizador lexico

%lex
%options case-insensitive

%%

//palabras reservadas
"imprimir"              return 'IMPRIMIR'
"int"                   return 'INT'
"double"                return 'DOUBLE'
"string"                return 'STRING'

// simbolos del sistema
";"                     return "PUNTOCOMA"
"+"                     return "MAS"
"-"                     return "MENOS"
"("                     return "PAR1"
")"                     return "PAR2"
"="                     return "IGUAL"
[0-9]+"."[0-9]+         return "DECIMAL"
[0-9]+                  return "ENTERO"
[a-z][a-z0-9_]*         return "ID"
[\"][^\"]*[\"]          {yytext=yytext.substr(1,yyleng-2); return 'CADENA'}

//blancos
[\ \r\t\f\t]+           {}
[\ \n]                  {}

// simbolo de fin de cadena
<<EOF>>                 return "EOF"


%{
    // CODIGO JS SI FUESE NECESARIO
%}

/lex

//precedencias
%left 'MAS' 'MENOS'
%right 'UMENOS'

// simbolo inicial
%start INICIO

%%

INICIO : INSTRUCCIONES EOF                  {return $1;}
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION   {$1.push($2); $$=$1;}
            | INSTRUCCION                 {$$=[$1];}
;

INSTRUCCION : IMPRESION PUNTOCOMA            {$$=$1;}
            | DECLARACION PUNTOCOMA          {$$=$1;}
            | ASIGNACION PUNTOCOMA           {$$=$1;}
;

IMPRESION : IMPRIMIR PAR1 EXPRESION PAR2    {$$= new Print.default($3, @1.first_line, @1.first_column);}
;

DECLARACION : TIPOS ID IGUAL EXPRESION      {$$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4);}
;

ASIGNACION : ID IGUAL EXPRESION             {$$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column);}
;

EXPRESION : EXPRESION MAS EXPRESION          {$$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3);}
			| EXPRESION MENOS EXPRESION        {$$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3);}
			| PAR1 EXPRESION PAR2              {$$ = $2;}
			| MENOS EXPRESION %prec UMENOS     {$$ = new Aritmeticas.default(Aritmeticas.Operadores.NEG, @1.first_line, @1.first_column, $2);}
			| ENTERO                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column );}
			| DECIMAL                          {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column );}
			| CADENA                           {$$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), $1, @1.first_line, @1.first_column );}
			| ID                               {$$ = new AccesoVar.default($1, @1.first_line, @1.first_column);}      
;

TIPOS : INT             {$$ = new Tipo.default(Tipo.tipoDato.ENTERO);}
		| DOUBLE          {$$ = new Tipo.default(Tipo.tipoDato.DECIMAL);}
		| STRING          {$$ = new Tipo.default(Tipo.tipoDato.CADENA);}
	;

// =======================================================================================================================================================

// %{
// 	var cadena = '';
// 	var errors = [];
// 	const Nativo = require('./expresiones/Nativo')
// 	const Tipo = require('./simbolo/Tipo')
// %}
// %lex

// %options case-insensitive
// %x string

// %%

// \s+                   				// Espacios en blanco
// "//".*								// Comentario de una linea
// [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]	// Comentario Multilinea
// //----------Tipo de dato----------
// "double"             	return 'DOUBLE'
// "int"             		return 'INTEGER'
// "bool"              	return 'BOOLEAN'
// "char"             		return 'CHAR'
// "std::String"		    return 'STRING'
// //----------Operadores Aritmeticos----------
// "+"                   	return 'ARI_SUMA'
// "-"                   	return 'ARI_MENOS'
// "*"                   	return 'ARI_MULTIPLICACION'
// "/"                   	return 'ARI_DIVISION'
// "POW"                   return 'ARI_POTENCIA'
// "%"                   	return 'ARI_MODULO'
// //----------Operadores Relacionales----------
// "!="                   	return 'DIFERENCIACION'
// "=="                   	return 'IGUALACIONDOBLE'
// "="                   	return 'IGUALACION'
// "<="                   	return 'MENORIGUAL'
// ">="					return 'MAYORIGUAL'
// ">"                   	return 'MAYOR'
// "<"                   	return 'MENOR'
// //----------Operadores Logicos----------
// "||"                   	return 'OR'
// "&&"                   	return 'AND'
// "!"                     return 'NOT'
// //----------Signos de Agrupacion----------
// "("                   	return 'PARENTESIS_IZQ'
// ")"                   	return 'PARENTESIS_DER'
// "?"						return 'OP_TERNARIO'
// "["						return 'COR_IZQ'
// "]"						return 'COR_DER'
// //------------Otro operadores-------------
// ","                   	return 'COMA'
// ";"                   	return 'PUNTO_COMA'
// ":"						return 'DOSPUNTOS'
// "{"                   	return 'LLAVE_IZQ'
// "}"                   	return 'LLAVE_DER'
// //-------------Operadores Booleanos--------
// "true"                	return 'TRUE'
// "false"               	return 'FALSE'
// //----------Incremento y Decremento----------
// "++"					return 'INCREMENTO'
// "--"					return 'DECREMENTO'
// //----------Sentencias----------------
// "new"					return 'NEW'
// //----------Sentencias de Control------------
// "if"					return 'SENT_IF'
// "else"					return 'SENT_ELSE'
// "switch"				return 'SENT_SWITCH'
// "case"					return 'SENT_CASE'
// "break"					return 'SENT_BREAK'
// "default"			    return 'SENT_DEFAULT'
// //----------Sentencias Ciclicas--------------
// "while"               	return 'SENT_WHILE'
// "for"					return 'SENT_FOR'
// "do"					return 'SENT_DO'
// //-------Sentencias de Transferencia----------
// "break"					return 'SENT_BREAK'
// "continue"				return 'SENT_CONTINUE'
// "return"				return 'SENT_RETURN'
// "void"					return 'SENT_VOID'
// //-------Funciones----------
// "cout"                  return 'SENT_COUT'
// "tolower"				return 'SENT_TOLOWER'
// "toupper"				return 'SENT_TOUPPER'
// "round"					return 'SENT_ROUND'
// //--------Funciones Nativas--------
// "length"				return 'SENT_LENGTH'
// "typeof"				return 'SENT_TYPEOF'
// "toString"				return 'SENT_TOSTRING'
// "c_str"			        return 'SENT_TOCHARARRAY'
// "execute"				return 'SENT_RUN'
// //-----------ER----------------
// ([a-zA-Z])([a-zA-Z0-9_])* return 'IDENTIFICADOR'
// [']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?[']	return 'CARACTER'
// [0-9]+"."[0-9]+         return "NUM_DECIMAL"
// [0-9]+                  return "NUM_ENTERO"
// ["]						{ cadena = ''; this.begin("string"); }
// <string>[^"\\]+			{ cadena += yytext; }
// <string>"\\\""			{ cadena += "\""; }
// <string>"\\n"			{ cadena += "\n"; }
// <string>\s				{ cadena += " ";  }
// <string>"\\t"			{ cadena += "\t"; }
// <string>"\\\\"			{ cadena += "\\"; }
// <string>"\\\'"			{ cadena += "\'"; }
// <string>"\\r"			{ cadena += "\r"; }
// <string>["]				{ yytext = cadena; this.popState(); return 'CADENA'; }
// //-----------Fin de Cadena----------------
// <<EOF>>               	return 'EOF'
// //------Errores(cualquier cosa menos lo declarado)-----
// .                     	{ errors.push({ tipo: "Lexico", error: yytext, linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'ERROR_LEX'; } 

// //IMPORTACIONES
// %{
	
    
// %}

// /lex


// // Precedencias

// %left 'ARI_MULTIPLICACION' 'ARI_DIVISION'
// %left 'ARI_SUMA' 'ARI_MENOS'
// %left 'IGUALACIONDOBLE' 'DIFERENCIACION' 'MENOR' 'MENORIGUAL' 'MAYOR' 'MAYORIGUAL'
// %left 'OP_TERNARIO'
// %left 'OR'
// %left 'AND'
// %right 'NOT'
// %left signoMenos

// //Producciones
// %start INICIO_PR 
// %%
// INICIO_PR: CODIGO EOF                      {   return $1;/* console.log($1); */   }    // imprime el resultado de las instrucciones
// ;
// CODIGO : CODIGO INSTRUCCION       { $1.push($2); $$ = $1;}
//                 | INSTRUCCION                     { $$ = [$1]; }
// ;

// INSTRUCCION : D_VARIABLE       {   $$ = $1; /*console.log($1);  console.log($4);*/  }
// ;

// EXPRESION : IDENTIFICADOR                              {   $$ =$1; /*Number($1); */  }
// 			| NUM_ENTERO								   { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DOUBLE), $1, @1.first_line, @1.first_column ); }
// 			| NUM_DECIMAL                                  { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DOUBLE), $1, @1.first_line, @1.first_column ); }
// ;
// //pRUEBA DECALARION DE VARIABLES
// D_VARIABLE: TIPODATO IDENTIFICADOR IGUALACION EXPRESION PUNTO_COMA   {   $$ = $4; /*console.log($1);  console.log($4); */  }
// ;

// //----TIPOS DE DATOS----
// TIPODATO: CATEGORIADATO {$$ = $1}
// ;

// CATEGORIADATO:  DOUBLE {$$ = $1 }
// 				| INTEGER {$$ = $1}
// 				| BOOLEAN {$$ =$1;}
// 				| CHAR {$$ =$1;}
// 				| STRING {$$ =$1;}
// ;