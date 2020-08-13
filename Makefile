# Coppies and builds prereqs for website from other repos

MV=mv -f
CP=cp -r

all: rastjs terra algs
	@echo "Build Completed"

rastjs:
	$(RM) -r assets/graphics/engine
	$(CP) ../rastjs/engine assets/graphics/engine

terra:
	$(MAKE) -C ../terra
	$(RM) -r assets/graphics/terra
	$(CP) ../terra/out assets/graphics/terra

algs:
	$(MAKE) -C ../rna-predict
	$(CP) ../rna-predict/out/rshape.wasm assets/compute
	$(CP) ../rna-predict/out/rshape.js assets/compute

